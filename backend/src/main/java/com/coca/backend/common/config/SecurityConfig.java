package com.coca.backend.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class SecurityConfig {

    /**
     * 공개 API와 인증이 필요한 API를 구분한다.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {
        http
            // 기존 WebConfig의 CORS 설정 사용
            .cors(cors -> {})
            // 공개 회원가입 API에 한해 CSRF 검사 제외
            .csrf(csrf -> csrf
                .ignoringRequestMatchers(
                    "/api/member/sign-up"
                )
            )
            // API 접근 권한 설정
            .authorizeHttpRequests(auth -> auth
                // 회원가입은 비회원도 이용 가능
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/member/sign-up"
                ).permitAll()
                // 나머지 API는 인증 필요
                .anyRequest().authenticated()
            )
            // 개발 초기에는 HTTP Basic 인증 사용
            .httpBasic(basic -> {});
        
        return http.build();
    }
    
    /**
     * 회원 비밀번호를 BCrypt 방식으로 해싱하기 위한 Bean 등록.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
