--SELECT address, COUNT(*)
--FROM organisations
--GROUP BY address
--HAVING COUNT(*) > 1;

select count(distinct("address")) as distinct, count(*) from organisations;

--select count(distinct("address")) as distinct, count(*) from applications where "appId"='ds:share';

--DELETE from organisations WHERE id IN (
--	SELECT id FROM (
--		SELECT id, ROW_NUMBER() OVER w AS rnum
--		FROM organisations
--		WINDOW w AS (
--			PARTITION BY address
--			ORDER BY ID
--		)
--	) t
--	WHERE t.rnum > 1)