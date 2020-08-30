import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface TransactionTDO {
  title: string;
  value: number;
  type: string;
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: TransactionTDO): Transaction {
    if (type !== 'outcome' && type !== 'income') {
      throw new Error('Invalid transaction type.');
    }

    if (!Number(value)) {
      throw new Error('Invalid value.');
    }

    const currentBalance = this.transactionsRepository.getBalance();

    if (type === 'outcome' && currentBalance.total < value) {
      throw new Error('Not enough balance to complete transaction.');
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
