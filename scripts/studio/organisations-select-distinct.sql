SELECT address, COUNT(*)
FROM organisations
GROUP BY address
HAVING COUNT(*) > 1;