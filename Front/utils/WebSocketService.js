export class WebSocketService {
    static HOST = 'localhost:8080';
    static RECONNECT_DELAY = 5000;
    static MAX_RETRIES = 3;

    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.onPlayersUpdate = null;
        this.connectionAttempts = 0;
        this.pendingMessages = [];
        this.sessionId = null;
    }

    receiveWebSocketData() {
        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('📩 WebSocket Data Received:', {
                    timestamp: new Date().toISOString(),
                    data: data
                });

                // Log specific data types
                if (data.players) {
                    console.log('🎮 Players Update:', data.players);
                }
                if (data.type) {
                    console.log(`Message Type: ${data.type}`);
                    switch (data.type) {
                        case 'playerUpdate':
                            console.log('Player Update:', {
                                id: data.id,
                                position: { x: data.x, y: data.y },
                                direction: data.direction,
                                hasPerson: data.hasPerson
                            });
                            break;
                        case 'playerJoin':
                            console.log('New Player Joined:', data.id);
                            break;
                        case 'playerDisconnect':
                            console.log('Player Disconnected:', data.id);
                            break;
                    }
                }

                // Handle the message after logging
                this.handleMessage(event);
            } catch (error) {
                console.error('Error processing WebSocket data:', error);
            }
        };
    }

    connect() {
        if (this.connectionAttempts >= WebSocketService.MAX_RETRIES) {
            console.error('Max reconnection attempts reached');
            return;
        }

        try {
            if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
                this.socket.close();
            }

            // Changed endpoint to match Spring's default endpoint
            console.log(`Connecting to WebSocket... (Attempt ${this.connectionAttempts + 1})`);
            this.socket = new WebSocket(`ws://${WebSocketService.HOST}/game`);

            this.socket.onopen = () => {
                console.log('WebSocket Connected');
                this.isConnected = true;
                this.connectionAttempts = 0;
                // Enviar mensaje inicial para registrar al jugador
                this.sendPlayerData({
                    type: 'playerJoin',
                    timestamp: Date.now()
                });
                this.processQueuedMessages();
            };

            this.socket.onmessage = (event) => {
                this.handleMessage(event);
            };

            this.socket.onclose = (event) => {
                console.warn(`Connection closed: ${event.code}`);
                this.isConnected = false;
                if (event.code !== 1000) {
                    this.handleReconnect();
                }
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket Error:', error);
                this.isConnected = false;
                this.handleReconnect();
            };

        } catch (error) {
            console.error('Connection error:', error);
            this.handleReconnect();
        }
    }

    handleMessage(event) {
        try {
            const message = JSON.parse(event.data);
            console.log('Received message:', message);

            // Handle positions broadcast message
            if (message.type === 'positions' && message.players) {
                console.log('Positions Update Received');
                Object.entries(message.players).forEach(([playerId, playerData]) => {
                    if (this.onPlayersUpdate) {
                        this.onPlayersUpdate({
                            type: 'playerUpdate',
                            id: playerId,
                            x: playerData.x || 0,
                            y: playerData.y || 0,
                            direction: playerData.direction || 'right',
                            hasPerson: playerData.hasPerson || false,
                            sprite: 'bus' // Placeholder for sprite, replace with actual logic
                        });
                    }
                });
                return;
            }

            // Handle other message types

            if (message.error) {
                console.error(' Server Error:', message.error);
                return;
            }

            if (!message.type) {
                console.error('Invalid message format:', message);
                return;
            }

            switch (message.type) {
                case 'playerUpdate':
                    if (this.onPlayersUpdate) {
                        this.onPlayersUpdate({
                            type: 'playerUpdate',
                            id: message.id,
                            x: message.x || 0,
                            y: message.y || 0,
                            direction: message.direction || 'right',
                            hasPerson: message.hasPerson || false
                        });
                    }
                    break;
                case 'playerDisconnect':
                    if (this.onPlayersUpdate) {
                        this.onPlayersUpdate({
                            type: 'playerDisconnect',
                            id: message.id
                        });
                    }
                    break;
                default:
                    console.warn(' Unknown message type:', message.type);
            }
        } catch (error) {
            console.error(' Error parsing message:', error, 'Raw message:', event.data);
        }
    }
    handleClose(event) {
        this.isConnected = false;
        console.log(`Connection closed: ${event.code}`);
        if (event.code !== 1000) {
            this.handleReconnect();
        }
    }

    handleError(error) {
        console.error('WebSocket Error:', error);
        this.isConnected = false;
    }

    processQueuedMessages() {
        while (this.pendingMessages.length > 0) {
            const msg = this.pendingMessages.shift();
            this.sendPlayerData(msg);
        }
    }

    sendPlayerData(playerData) {
        if (!this.isConnected || !this.socket || this.socket.readyState !== WebSocket.OPEN) {
            this.pendingMessages.push(playerData);
            return;
        }

        try {
            const message = JSON.stringify({
                ...playerData,
                timestamp: Date.now() // Añadir timestamp para debugging
            });
            this.socket.send(message);
        } catch (error) {
            console.error('Error sending player data:', error);
            this.pendingMessages.push(playerData);
            this.handleReconnect();
        }
    }

    sendPlayerPosition(playerData) {
        const data = {
            type: 'playerUpdate',
            id: playerData.id,
            x: playerData.x,
            y: playerData.y,
            direction: playerData.direction,
            hasPerson: playerData.hasPerson || 0
        };
        this.sendPlayerData(data);
    }

    handleReconnect() {
        this.connectionAttempts++;
        if (this.connectionAttempts < WebSocketService.MAX_RETRIES) {
            const delay = WebSocketService.RECONNECT_DELAY * this.connectionAttempts;
            console.log(`Reconnecting in ${delay / 1000}s...`);
            setTimeout(() => this.connect(), delay);
        }
    }

    setPlayersUpdateCallback(callback) {
        this.onPlayersUpdate = callback;
    }

    disconnect() {
        if (this.socket) {
            this.socket.close(1000, 'Client disconnecting');
            this.socket = null;
            this.isConnected = false;
            this.connectionAttempts = 0;
        }
    }
}