CREATE OR REPLACE VIEW "ServerWithAvailableCapacity" AS
SELECT
    s.*,
    COUNT(r.code) AS rooms,
    s.capacity - COUNT(r.code) AS available
FROM "Server" s
INNER JOIN "Room" r ON r.server = s.name
GROUP BY s.name;