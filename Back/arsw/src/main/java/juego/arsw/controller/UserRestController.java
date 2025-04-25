package juego.arsw.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

import org.json.JSONObject;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import juego.arsw.model.User;

@RestController
public class UserRestController extends TextWebSocketHandler {
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final Map<String, User> players = new ConcurrentHashMap<>();
    private static final Logger logger = Logger.getLogger(UserRestController.class.getName());
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String playerId = session.getId();
        sessions.put(playerId, session);
        players.put(playerId, new User(playerId));

        // Send initial state to the newly connected player
        broadcastPlayerStates();
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String playerId = session.getId();
        String payload = message.getPayload();

        try {
            JSONObject data = new JSONObject(payload);
            updatePlayer(playerId, data);
            broadcastPlayerPositions(); // Usar el nuevo método aquí
        } catch (Exception e) {
            logger.severe("Error processing message: " + e.getMessage());
            sendErrorMessage(session, "Error processing message");
        }
    }

    private void updatePlayer(String playerId, JSONObject data) {
        User player = players.get(playerId);
        if (player != null) {
            if (data.has("x")) player.setX(data.getDouble("x"));
            if (data.has("y")) player.setY(data.getDouble("y"));
            if (data.has("direction")) player.setDirection(data.getString("direction"));
        }
    }

    private void sendGameState() {
        try {
            Map<String, Object> gameState = new HashMap<>();
            Map<String, Object> playersData = new HashMap<>();

            // Recolectar datos de todos los jugadores
            players.forEach((id, player) -> {
                Map<String, Object> playerData = new HashMap<>();
                playerData.put("x", player.getX());
                playerData.put("y", player.getY());
                playerData.put("direction", player.getDirection());
                playersData.put(id, playerData);
            });

            gameState.put("type", "gameState");
            gameState.put("players", playersData);
            
            // Convertir a JSON y enviar
            String jsonMessage = objectMapper.writeValueAsString(gameState);
            TextMessage message = new TextMessage(jsonMessage);

            sessions.values().forEach(session -> {
                try {
                    if (session.isOpen()) {
                        session.sendMessage(message);
                        logger.info("Sent game state: " + jsonMessage);
                    }
                } catch (IOException e) {
                    logger.warning("Error sending to session " + session.getId() + ": " + e.getMessage());
                }
            });
        } catch (Exception e) {
            logger.severe("Error creating game state message: " + e.getMessage());
        }
    }

    private void sendErrorMessage(WebSocketSession session, String errorMessage) {
        try {
            Map<String, Object> error = new HashMap<>();
            error.put("type", "error");
            error.put("message", errorMessage);
            
            String jsonError = objectMapper.writeValueAsString(error);
            session.sendMessage(new TextMessage(jsonError));
        } catch (IOException e) {
            logger.severe("Error sending error message: " + e.getMessage());
        }
    }

    private void broadcastPlayerStates() {
        JSONObject gameState = new JSONObject();
        JSONObject playersState = new JSONObject();

        players.forEach((id, player) -> {
            JSONObject playerData = new JSONObject();
            playerData.put("x", player.getX());
            playerData.put("y", player.getY());
            playerData.put("direction", player.getDirection());
            playersState.put(id, playerData);
        });

        gameState.put("players", playersState);
        TextMessage message = new TextMessage(gameState.toString());

        sessions.values().forEach(session -> {
            try {
                if (session.isOpen()) {
                    session.sendMessage(message);
                    logger.info(message.getPayload());
                }
            } catch (IOException e) {
                logger.warning("Error sending message to " + session.getId() + ": " + e.getMessage());
            }
        });
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String playerId = session.getId();
        sessions.remove(playerId);
        players.remove(playerId);
        logger.info("Player " + playerId + " disconnected");
        broadcastPlayerStates();
    }

    private void broadcastPlayerPositions() {
        try {
            Map<String, Object> broadcast = new HashMap<>();
            Map<String, Object> positions = new HashMap<>();
    
            // Recolectar posiciones de todos los jugadores
            players.forEach((id, player) -> {
                Map<String, Object> position = new HashMap<>();
                position.put("x", player.getX());
                position.put("y", player.getY());
                position.put("direction", player.getDirection());
                positions.put(id, position);
            });
    
            broadcast.put("type", "positions");
            broadcast.put("players", positions);
    
            // Convertir a JSON y enviar
            String jsonMessage = objectMapper.writeValueAsString(broadcast);
            TextMessage message = new TextMessage(jsonMessage);
    
            // Enviar a todas las sesiones activas
            sessions.values().forEach(session -> {
                try {
                    if (session.isOpen()) {
                        session.sendMessage(message);
                        logger.info("Broadcast positions: " + jsonMessage);
                    }
                } catch (IOException e) {
                    logger.warning("Error broadcasting to session " + session.getId() + ": " + e.getMessage());
                }
            });
        } catch (Exception e) {
            logger.severe("Error broadcasting positions: " + e.getMessage());
        }
    }
}