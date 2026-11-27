package com.coca.backend.domain.channel.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardCategoryRequest {
	private String categoryName;
	private Integer displayOrder;
}
