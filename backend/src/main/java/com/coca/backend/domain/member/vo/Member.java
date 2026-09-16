package com.coca.backend.domain.member.vo;

import java.time.LocalDateTime;

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
public class Member {
	private Long userNo;              // USER_NO (PK)
    private Integer authority;        // AUTHORITY (1: 가입회원, 2: 인증회원, 3: 관리자)
    private String userEmail;         // USER_EMAIL (선택/추후 인증)
    private String userId;            // USER_ID
    private String userPwd;           // USER_PWD (암호화되어 저장됨)
    private String userName;          // USER_NAME
    private String userAddress;       // USER_ADDRESS
    private String userPhone;         // USER_PHONE
    private LocalDateTime userEnrollDate; // USER_ENROLL_DATE
    private String userDeleteYn;      // USER_DELETE_YN ('N' / 'Y')
    private Integer noPayCount;       // NO_PAY_COUNT
    private String userStatus;        // USER_STATUS ('N')
    private Long userPoint;           // USER_POINT (포인트 잔액)
}
