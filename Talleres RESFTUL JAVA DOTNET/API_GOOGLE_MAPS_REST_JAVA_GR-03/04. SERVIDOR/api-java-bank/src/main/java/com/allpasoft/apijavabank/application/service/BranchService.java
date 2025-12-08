package com.allpasoft.apijavabank.application.service;

import com.allpasoft.apijavabank.application.dto.BranchDto;
import com.allpasoft.apijavabank.application.dto.CreateBranchDto;
import com.allpasoft.apijavabank.application.dto.UpdateBranchDto;
import com.allpasoft.apijavabank.domain.entity.Branch;
import com.allpasoft.apijavabank.domain.repository.BranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BranchService {

    private final BranchRepository branchRepository;

    public List<BranchDto> getAll() {
        return branchRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Optional<BranchDto> getById(Long id) {
        return branchRepository.findById(id).map(this::toDto);
    }

    public BranchDto create(CreateBranchDto dto) {
        Branch branch = new Branch();
        branch.setName(dto.getName());
        branch.setLatitude(dto.getLatitude());
        branch.setLongitude(dto.getLongitude());
        branch.setPhoneNumber(dto.getPhoneNumber());
        branch.setEmail(dto.getEmail());
        branch.setIsActive(true);
        branch.setCreatedAt(LocalDateTime.now());
        
        return toDto(branchRepository.save(branch));
    }

    public Optional<BranchDto> update(Long id, UpdateBranchDto dto) {
        return branchRepository.findById(id).map(branch -> {
            branch.setName(dto.getName());
            branch.setLatitude(dto.getLatitude());
            branch.setLongitude(dto.getLongitude());
            branch.setPhoneNumber(dto.getPhoneNumber());
            branch.setEmail(dto.getEmail());
            branch.setIsActive(dto.getIsActive());
            branch.setUpdatedAt(LocalDateTime.now());
            return toDto(branchRepository.save(branch));
        });
    }

    public boolean delete(Long id) {
        if (branchRepository.existsById(id)) {
            branchRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private BranchDto toDto(Branch branch) {
        return new BranchDto(
                branch.getId(),
                branch.getName(),
                branch.getLatitude(),
                branch.getLongitude(),
                branch.getPhoneNumber(),
                branch.getEmail(),
                branch.getIsActive(),
                branch.getCreatedAt(),
                branch.getUpdatedAt()
        );
    }
}
