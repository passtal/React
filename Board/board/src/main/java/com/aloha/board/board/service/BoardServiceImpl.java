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
        return boardMapper.insert(board) > 0;
    }

    @Override
    public boolean update(Boards board) {
        return boardMapper.update(board) > 0;
    }

    @Override
    public boolean delete(Long no) {
        return boardMapper.delete(no) > 0;
    }

    
}