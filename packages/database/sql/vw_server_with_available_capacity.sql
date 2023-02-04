CREATE OR REPLACE VIEW "ServerWithAvailableCapacity" AS
SELECT
    s.*,
    COUNT(r.code) AS "numberOfRooms",
    s.capacity - COUNT(r.code) AS "availableCapacity"
FROM "Server" s
LEFT JOIN "Room" r ON r.server = s.name
GROUP BY s.name;