## Installation

```shell script
# build the oracle database image
docker build  -t aburnazy/oracle-db-xe oracle-db/

#build the check status nodejs app image (http://localhost:3000/check)
docker build  -t aburnazy/yota-sc yota-check-status/

#build the payment gateway nodejs app image (http://localhost:3001/payment)
docker build  -t aburnazy/yota-gp yota-payment-gateway/

#Run everything together
docker-compose up

# Check the status of customer
curl  http://localhost:3000/check/37491782745  -H "Content-Type: application/json"

# Make payment for customer
curl -X POST http://localhost:3001/payment \
 -H "Content-Type: application/json" \
-d '{"msisdn":"37491782745", "paymentAmount":1000, "operationCode": 1, "paymentDate": 1593525119470}'
```

