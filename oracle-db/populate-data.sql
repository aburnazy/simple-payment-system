-- Populate data
set cmdsep /
DECLARE
    CUSTOMER_ID NUMBER := 0;
BEGIN
    CUSTOMER_ID := yotaott.customer_id_seq.nextval;

    INSERT INTO yotaott.customer VALUES  (CUSTOMER_ID, '37491782745', 1);
    INSERT INTO yotaott.balance VALUES  (yotaott.balance_id_seq.nextval, CUSTOMER_ID, 1000, SYSTIMESTAMP);


    CUSTOMER_ID := yotaott.customer_id_seq.nextval;
    INSERT INTO yotaott.customer VALUES  (CUSTOMER_ID, '37499009098', 0);
    INSERT INTO yotaott.balance VALUES  (yotaott.balance_id_seq.nextval, CUSTOMER_ID, 500, SYSTIMESTAMP);

END;
/
set cmds off