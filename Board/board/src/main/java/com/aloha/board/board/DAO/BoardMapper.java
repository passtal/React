package com.aloha.board.board.DAO;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.aloha.board.board.DTO.Boards;

@Mapper
public interface BoardMapper {
    
    // 목록
    public List<Boards> list();

    // 조회
    public Boards select(Long no);

    // 등록
    public int insert(Boards board);

    // 수정
    public int update(Boards board);

    // 삭제
    public int delete(Long no);

    // id로 조회
    public Boards selectById(String id);

    // id로 수정
    public int updateById(Boards board);

    // id로 삭제
    public int deleteById(String id);
}