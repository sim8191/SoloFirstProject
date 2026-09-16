package com.coca.backend.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberSignInResponse {
	private Long userNo;
    private String userId;      // 로그인 아이디
    private String userName;    // 사용자 이름
    private String userEmail;   // 이메일
    private Integer authority;  // 권한 등급 (1: 일반, 2: 본인인증, 3: 관리자 등)
    private Long userPoint;		// 보유 포인트 잔액
}
