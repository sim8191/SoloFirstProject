
package com.coca.backend.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Spring Security의 인증, 접근 권한 및 세션을 관리한다.
 */
@Configuration
public class SecurityConfig {

    /**
     * API 접근 권한과 세션 기반 인증 정책을 설정한다.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            SecurityContextRepository securityContextRepository)
            throws Exception {

        http
            // 기존 WebConfig의 CORS 설정 사용
            .cors(cors -> {})

            // 개발 단계: 회원가입과 로그인 요청은 CSRF 검사 제외
            .csrf(csrf -> csrf
                .ignoringRequestMatchers(
                    "/api/member/sign-up",
                    "/api/member/sign-in"
                )
            )

            // 공개 API와 인증이 필요한 API 구분
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/member/sign-up",
                    "/api/member/sign-in"
                ).permitAll()

                // 나머지 API는 로그인 필요
                .anyRequest().authenticated()
            )
            // 필요할 때 HTTP 세션 생성
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
            // Spring Security 인증 정보를 세션에서 조회
            .securityContext(context -> context
                .securityContextRepository(securityContextRepository)
            )
            // 기본 로그인 화면과 HTTP Basic 인증 사용 안 함
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }

    /**
     * 인증 정보를 HTTP 세션에 저장하고 조회하는 객체 등록.
     */
    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    /**
     * 회원 비밀번호를 BCrypt 방식으로 해싱한다.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
