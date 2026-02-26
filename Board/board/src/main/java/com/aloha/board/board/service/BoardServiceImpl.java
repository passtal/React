package com.aloha.board.board.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aloha.board.board.DAO.BoardMapper;
import com.aloha.board.board.DTO.Boards;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class BoardServiceImpl implements BoardService {

    private final BoardMapper boardMapper;

    @Override
    public List<Boards> list() {
        return boardMapper.list();
    }

    @Override
    public Boards select(Long no) {
        return boardMapper.select(no);
    }

    @Override
    public boolean insert(Boards board) {
        int result = boardMapper.insert(board);
        return result > 0;
    }

    @Override
    public boolean update(Boards board) {
        int result = boardMapper.update(board);
        return result > 0;
    }

    @Override
    public boolean delete(Long no) {
        int result = boardMapper.delete(no);
        return result > 0;
    }

    @Override
    public Boards selectById(String id) {
        return boardMapper.selectById(id);
    }

    @Override
    public boolean updateById(Boards board) {
        int result = boardMapper.updateById(board);
        return result > 0;
    }

    @Override
    public boolean deleteById(String id) {
        int result = boardMapper.deleteById(id);
        return result > 0;
    }
    
}