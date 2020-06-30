## Installation

```shell script
# build the oracle database image
docker build  -t aburnazy/oracle-db-xe oracle-db/

#build the check status nodejs app image
docker build  -t aburnazy/yota-sc yota-check-status/

#build the payment gateway nodejs app image
docker build  -t aburnazy/yota-gp yota-payment-gateway/

#Run everything together
docker-compose up
```

