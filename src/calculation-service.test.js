const calculationService = require('./calculation-service');

const calculateSomething = async (calculationService, a, b) =>
  calculationService.calculate(a, b);

describe('Calculation service', () => {
  it('should return calculated value', async () => {
    const result = await calculationService.calculate();

    expect(result).toEqual(5);
  });

  describe('mocking resolved value', () => {
    it('should resolve mocked value', async () => {
      const value = 2;
      jest.spyOn(calculationService, 'calculate').mockResolvedValue(value);

      const result = await calculationService.calculate();

      expect(result).toEqual(value);
    });

    it('should resolve value by mocked implementation', async () => {
      const value = 2;
      jest
        .spyOn(calculationService, 'calculate')
        .mockImplementation(async (a) => Promise.resolve(a));

      const result = await calculationService.calculate(value);

      expect(result).toEqual(value);
    });
  });

  describe('mocking rejected value', () => {
    it('should reject mocked value', async () => {
      jest
        .spyOn(calculationService, 'calculate')
        .mockRejectedValue(new Error('some error message'));

      await expect(calculateSomething(calculationService)).rejects.toThrowError(
        Error
      );
    });

    it('should reject value by mocked implementation', async () => {
      jest
        .spyOn(calculationService, 'calculate')
        .mockImplementation(async () =>
          Promise.reject(new Error('some error message'))
        );

      await expect(calculateSomething(calculationService)).rejects.toThrowError(
        Error
      );
    });
  });

  describe('mocking value', () => {
    it('should return mocked value', () => {
      const value = 2;
      jest.spyOn(calculationService, 'calculate').mockReturnValue(value);

      const result = calculationService.calculate();

      expect(result).toEqual(value);
    });

    it('should return value by mocked implementation', () => {
      const value = 2;
      jest.spyOn(calculationService, 'calculate').mockImplementation((a) => a);

      const result = calculationService.calculate(value);

      expect(result).toEqual(value);
    });
  });

  describe('mocking chained methods', () => {
    it('should return value from chained methods', async () => {
      const value = 10;
      jest.spyOn(calculationService, 'get').mockReturnThis();
      jest.spyOn(calculationService, 'calculate').mockResolvedValue(value);

      const result = await calculationService.get().calculate();

      expect(result).toEqual(value);
    });
  });

  describe('mocking same method multiple times with different values', () => {
    it('should resolve mocked values', async () => {
      const firstValue = 2;
      const secondValue = 3;
      jest
        .spyOn(calculationService, 'calculate')
        .mockResolvedValueOnce(firstValue)
        .mockResolvedValueOnce(secondValue);

      const firstResult = await calculationService.calculate();
      const secondResult = await calculationService.calculate();

      expect(firstResult).toEqual(firstValue);
      expect(secondResult).toEqual(secondValue);
    });

    it('should return mocked values', async () => {
      const firstValue = 2;
      const secondValue = 3;
      jest
        .spyOn(calculationService, 'calculate')
        .mockReturnValueOnce(firstValue)
        .mockReturnValueOnce(secondValue);

      const firstResult = calculationService.calculate();
      const secondResult = calculationService.calculate();

      expect(firstResult).toEqual(firstValue);
      expect(secondResult).toEqual(secondValue);
    });

    it('should return values by mocked implementations', async () => {
      const firstValue = 2;
      const secondValue = 3;
      jest
        .spyOn(calculationService, 'calculate')
        .mockImplementationOnce((a) => a + firstValue)
        .mockImplementationOnce((a) => a + secondValue);

      const firstResult = calculationService.calculate(1);
      const secondResult = calculationService.calculate(1);

      expect(firstResult).toEqual(firstValue + 1);
      expect(secondResult).toEqual(secondValue + 1);
    });
  });

  describe('spy calls', () => {
    it('should spy method arguments', async () => {
      const firstValue = 2;
      const secondValue = 3;
      const spy = jest.spyOn(calculationService, 'calculate');

      await expect(
        calculateSomething(calculationService, firstValue, secondValue)
      );

      expect(spy).toHaveBeenCalledWith(firstValue, secondValue);
    });

    it('should spy method which is not called', async () => {
      const spy = jest.spyOn(calculationService, 'calculate');

      expect(spy).not.toHaveBeenCalledWith();
    });

    it('should spy for methods arguments', async () => {
      const firstValue = 0;
      const secondValue = 1;
      jest
        .spyOn(calculationService, 'calculate')
        .mockImplementationOnce((a) => a + 2)
        .mockImplementationOnce((a) => a + 3);

      calculationService.calculate(firstValue);
      calculationService.calculate(secondValue);

      [firstValue, secondValue].forEach((argument, index) => {
        expect(calculationService.calculate).toHaveBeenNthCalledWith(
          index + 1,
          argument
        );
      });
    });
  });
});
