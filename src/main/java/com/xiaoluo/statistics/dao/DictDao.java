package com.xiaoluo.statistics.dao;

import com.xiaoluo.statistics.entity.Dict;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * Created by Caedmon on 2016/1/14.
 */
@Component
public class DictDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    private RowMapper<Dict> rowMapper=new RowMapper() {
        @Override
        public Dict mapRow(ResultSet resultSet, int i) throws SQLException {
            Dict dict=new Dict();
            dict.setType(resultSet.getInt("type"));
            dict.setId(resultSet.getInt("id"));
            dict.setDescription(resultSet.getString("description"));
            return dict;
        }
    };
    public int update(Dict dict){
        String sql=null;
        if(dict.getId()==0){
            sql=" INSERT INTO t_dict (type,description) VALUES(?,?)";
            return jdbcTemplate.update(sql,new Object[]{dict.getType(),dict.getDescription()});
        }else{
            sql="UPDATE t_dict SET type=?,description=? WHERE  id=?";
            return jdbcTemplate.update(sql,new Object[]{dict.getType(), dict.getDescription(),dict.getId()});
        }

    }
    public int del(int id){
        String sql="DELETE FROM t_dict where id=?";
        return jdbcTemplate.update(sql,new Object[]{id});
    }
    public List<Dict> find(int type, String description){
        StringBuilder sql=new StringBuilder("SELECT * FROM t_dict where 1=1");
        if(type!=0){
            sql.append(" and type =").append(type);
        }
        if(!StringUtils.isEmpty(description)){
            sql.append(" and description like '%").append(description).append("%'");
        }

        return jdbcTemplate.query(sql.toString(),rowMapper);
    }
}