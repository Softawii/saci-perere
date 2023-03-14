package com.softawii.saciperere.repository;

import com.softawii.saciperere.entity.ChannelCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChannelCategoryRepository extends JpaRepository<ChannelCategory, Long> {
}
