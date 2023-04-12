const axios = require('axios');
const fs = require('fs/promises');

jest.mock('axios');
jest.mock('fs/promises');

describe('Mocking modules', () => {
  describe('External modules', () => {
    it('should return mocked value for external module', async () => {
      const value = 'test';
      axios.get.mockResolvedValue({ data: value });

      const result = await axios.get('https://www.google.com');

      expect(result.data).toEqual(value);
    });
  });

  describe('Native modules', () => {
    it('should return mocked value for native module', async () => {
      const value = 'test';

      const file = await fs.readFile('index.md');

      expect(file).toEqual(value);
    });
  });
});
