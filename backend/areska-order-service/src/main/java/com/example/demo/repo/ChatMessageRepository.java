package com.example.demo.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.ChatMessage;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {
    List<ChatMessage> findByOrderIdOrderBySentAtAsc(Integer orderId);
    List<ChatMessage> findByOrderIdAndIsReadFalse(Integer orderId);
}
