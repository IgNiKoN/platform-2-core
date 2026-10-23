-- P2-0016: откат 018c_quality_access_up.sql. Применять до 018_quality_down.sql.
drop function if exists quality.my_access(uuid);
