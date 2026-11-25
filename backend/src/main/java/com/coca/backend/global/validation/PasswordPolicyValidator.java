package com.coca.backend.global.validation;

import java.util.regex.Pattern;

public final class PasswordPolicyValidator {
	public static final int MIN_LENGTH = 8;
    public static final int MAX_LENGTH = 32;
    
    private static final Pattern EXCLUDED_CHARS = Pattern.compile("[\\s'\"\\\\<>|`]");
    private static final Pattern LETTER = Pattern.compile("[A-Za-z]");
    private static final Pattern SPECIAL_CHAR = Pattern.compile("[!@#$%^&*()_+\\-=\\[\\]{};:,./?~]");
    private static final Pattern ALLOWED_CHARS = Pattern.compile(
            "^[A-Za-z0-9!@#$%^&*()_+\\-=\\[\\]{};:,./?~]+$"
    );
    // 숫자 포함 여부 검증
    private static final Pattern NUMBER = Pattern.compile("[0-9]");
    
    private PasswordPolicyValidator() {
    }

    public static void validate(String password) {
        String message = validateMessage(password);
        if (message != null) {
            throw new IllegalArgumentException(message);
        }
    }

    public static String validateMessage(String password) {
        if (password == null || password.isBlank()) {
            return "비밀번호는 필수입니다.";
        }

        // 비밀번호 길이 검증
        if (password.length() < MIN_LENGTH || password.length() > MAX_LENGTH) {
            return "비밀번호는 " + MIN_LENGTH
                    + "자 이상 " + MAX_LENGTH + "자 이하여야 합니다.";
        }

        if (EXCLUDED_CHARS.matcher(password).find()) {
            return "비밀번호에 사용할 수 없는 문자가 있습니다. (공백, ', \", \\, <, >, |, ` 제외)";
        }

        if (!ALLOWED_CHARS.matcher(password).matches()) {
            return "비밀번호는 영문, 숫자, 허용된 특수문자(!@#$%^&* 등)만 사용할 수 있습니다.";
        }

        // 대문자 또는 소문자가 하나 이상 포함되어 있는지 검사
        if (!LETTER.matcher(password).find()) {
            return "비밀번호에 영문자를 하나 이상 포함해야 합니다.";
        }

        if (!SPECIAL_CHAR.matcher(password).find()) {
            return "비밀번호에 특수문자(!@#$%^&* 등)를 포함해야 합니다.";
        }
        
        if (!NUMBER.matcher(password).find()) {
            return "비밀번호에 숫자를 포함해야 합니다.";
        }

        return null;
    }
}
