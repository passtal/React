package com.aloha.board.board.service;

import java.util.List;

import com.aloha.board.board.DTO.Boards;

public interface BoardService {

    public List<Boards> list();

    public Boards select(Long no);

    public boolean insert(Boards board);

    public boolean update (Boards board);

    public boolean delete (Long no);
    
}