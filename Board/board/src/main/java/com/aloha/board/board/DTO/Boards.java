package com.aloha.board.board.DTO;

import java.util.Date;

import lombok.Data;

@Data
public class Boards {
    private Long no;            // PK
    private String id;          // UK
    private String title;       // 제목
    private String writer;      // 작성자
    private String content;     // 내용
    private Date createdAt;     // 등록일자
    private Date updatedAt;     // 수정일자

    public Boards() {
        this.id = java.util.UUID.randomUUID().toString();
    }
}