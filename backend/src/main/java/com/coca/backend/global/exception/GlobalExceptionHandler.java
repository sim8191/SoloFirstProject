package com.coca.backend.global.exception;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
	
	/**
     * 입력값 검증 실패 등 잘못된 요청을 처리한다.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(
            IllegalArgumentException e) {

        String message = e.getMessage();

        if (message == null || message.isBlank()) {
            message = "입력한 정보를 확인해 주세요.";
        }

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", message));
    }

    /**
     * 예상하지 못한 서버 내부 오류를 처리한다.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleServerError(
            Exception e) {

        // 상세 오류는 서버 로그에만 기록
        log.error("서버 내부 오류 발생", e);

        // 사용자에게는 내부 오류 내용을 노출하지 않는다
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "message",
                    "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
                ));
    }
}
