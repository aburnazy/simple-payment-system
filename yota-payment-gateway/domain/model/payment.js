class Payment {
  constructor(id, date, operationCode, customerId, paymentAmount, status) {
    this.id = id;
    this.date = date;
    this.operationCode = operationCode;
    this.customerId = customerId;
    this.paymentAmount = paymentAmount;
    this.status = status;
  }
}

module.exports = Payment;
