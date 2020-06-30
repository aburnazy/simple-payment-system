set serveroutput on

-- Create user and set permissions
create user yotaott identified by "yota0TT";

grant CREATE SESSION, ALTER SESSION, CREATE DATABASE LINK, 
  CREATE MATERIALIZED VIEW, CREATE PROCEDURE, CREATE PUBLIC SYNONYM, 
  CREATE ROLE, CREATE SEQUENCE, CREATE SYNONYM, CREATE TABLE, 
  CREATE TRIGGER, CREATE TYPE, CREATE VIEW, UNLIMITED TABLESPACE 
  to yotaott;
  
-- setup customer table and sequence
CREATE TABLE yotaott.customer (
   customer_id NUMBER,
   msisdn VARCHAR2(30)
      CONSTRAINT msisdn_not_null NOT NULL UNIQUE,
   status NUMBER(1, 0) DEFAULT 0 NOT NULL CONSTRAINT customer_status_is_bool CHECK (status =0 OR status = 1),
   CONSTRAINT customer_pk PRIMARY KEY (customer_id));  
   
CREATE SEQUENCE yotaott.customer_id_seq 
   START WITH 1
   INCREMENT BY 1;  

-- setup payment table and sequence

CREATE TABLE yotaott.payment (
   payment_id NUMBER,
   payment_date TIMESTAMP,
   operation_id NUMBER,
   customer_id CONSTRAINT fk_payment_customer_id REFERENCES yotaott.customer(customer_id),
   payment_ammount NUMBER,
   status NUMBER(1, 0) DEFAULT 0 NOT NULL CONSTRAINT payment_status_is_bool CHECK (status =0 OR status = 1),
   CONSTRAINT payment_pk PRIMARY KEY (payment_id));  
   
CREATE SEQUENCE yotaott.payment_id_seq 
   START WITH 1
   INCREMENT BY 1;  
   
-- setup balance table and sequence

CREATE TABLE yotaott.balance (
   balance_id NUMBER,
   customer_id CONSTRAINT fk_balance_customer_id REFERENCES yotaott.customer(customer_id)  UNIQUE,
   balance NUMBER,
   modified_on TIMESTAMP,
   CONSTRAINT balance_pk PRIMARY KEY (balance_id));  
   
CREATE SEQUENCE yotaott.balance_id_seq 
   START WITH 1
   INCREMENT BY 1;  

-- Create the trigger
set cmdsep /
CREATE TRIGGER yotaott.balance_modified_trigger
BEFORE INSERT OR UPDATE ON yotaott.balance
FOR EACH ROW
BEGIN
    :new.modified_on := SYSTIMESTAMP;
END;
/
set cmds off