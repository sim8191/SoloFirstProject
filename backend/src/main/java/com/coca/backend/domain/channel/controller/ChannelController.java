package com.coca.backend.domain.channel.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coca.backend.domain.channel.dto.ChannelCreateRequest;
import com.coca.backend.domain.channel.dto.ChannelCreateResponse;
import com.coca.backend.domain.channel.service.ChannelService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/channels")
@RequiredArgsConstructor
public class ChannelController {
	
	private final ChannelService channelService;
	
	@PostMapping
    public ResponseEntity<ChannelCreateResponse> createChannel(
            @RequestBody ChannelCreateRequest request,
            Authentication authentication) {

        // 현재 로그인한 회원의 아이디 가져오기
        String userId = authentication.getName();

        // 채널 생성 Service 호출
        ChannelCreateResponse response =
                channelService.createChannel(request, userId);

        // 채널 생성 성공 시 HTTP 201 반환
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
	
}
