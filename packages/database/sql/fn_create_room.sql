CREATE OR REPLACE FUNCTION create_room(server TEXT, length INTEGER, max_attempts INTEGER)
RETURNS TEXT AS $$
DECLARE
    generatedCode TEXT;
    attempts INTEGER := 0;
BEGIN
    WHILE attempts < max_attempts LOOP
        generatedCode := (SELECT lpad(floor(random() * (10^length)::numeric)::text, length, '0'));
        IF NOT EXISTS (SELECT 1 FROM "Room" r WHERE r.code = generatedCode) THEN
            INSERT INTO "Room" (code, "createdAt", server) VALUES (generatedCode, NOW(), server);
            RETURN generatedCode;
        END IF;
        attempts := attempts + 1;
    END LOOP;
    RAISE EXCEPTION 'Maximum attempts reached to generate a unique code';
END
$$ LANGUAGE plpgsql;