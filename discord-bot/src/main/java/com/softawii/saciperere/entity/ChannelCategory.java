package com.softawii.saciperere.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.Objects;

@Entity
public class ChannelCategory {
    @Id
    private Long channelId;
    private Long categoryId;

    public ChannelCategory() {
    }

    public ChannelCategory(Long channelId, Long categoryId) {
        this.channelId = channelId;
        this.categoryId = categoryId;
    }

    public Long getChannelId() {
        return channelId;
    }

    public void setChannelId(Long channelId) {
        this.channelId = channelId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChannelCategory that = (ChannelCategory) o;
        return channelId.equals(that.channelId) && categoryId.equals(that.categoryId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(channelId, categoryId);
    }
}
