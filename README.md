## Installation

```shell script
git clone https://github.com/aburnazy/simple-payment-system.git
cd simple-payment-system

# build the oracle database image
sudo docker build  -t dataart/oracle-db-xe oracle-db/

#build the check status nodejs app image (http://localhost:3000/check)
sudo docker build  -t dataart/yota-cs yota-check-status/

#build the payment gateway nodejs app image (http://localhost:3001/payment)
sudo docker build  -t dataart/yota-pg yota-payment-gateway/

#Run everything together
sudo docker-compose up

# Check the status of customer
curl  http://localhost:3000/check/37499001122  -H "Content-Type: application/json"

# Make payment for customer
curl -X POST http://localhost:3001/payment \
 -H "Content-Type: application/json" \
-d '{"msisdn":"37499001122", "sum":1000, "operation": 1, "date": 1593525119470}'
```

