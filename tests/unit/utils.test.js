const { calculateBMI, average, median } = require('../../src/utils/compute');
const { countWins, computeCountryWinRatios } = require('../../src/utils/stats');

describe('Compute Utils', () => {
  describe('calculateBMI', () => {
    test('should calculate BMI correctly for normal values', () => {
      // Arrange - 80kg, 180cm
      const weightGrams = 80000;
      const heightCm = 180;

      // Act
      const bmi = calculateBMI(weightGrams, heightCm);

      // Assert
      expect(bmi).toBe(24.69); // 80 / (1.8^2) = 24.69
    });

    test('should handle edge case with different values', () => {
      // Arrange - 75kg, 175cm
      const weightGrams = 75000;
      const heightCm = 175;

      // Act
      const bmi = calculateBMI(weightGrams, heightCm);

      // Assert
      expect(bmi).toBe(24.49); // 75 / (1.75^2) = 24.49
    });

    test('should return null for zero height', () => {
      // Arrange
      const weightGrams = 80000;
      const heightCm = 0;

      // Act
      const bmi = calculateBMI(weightGrams, heightCm);

      // Assert
      expect(bmi).toBeNull();
    });

    test('should return null for negative height', () => {
      // Arrange
      const weightGrams = 80000;
      const heightCm = -180;

      // Act
      const bmi = calculateBMI(weightGrams, heightCm);

      // Assert
      expect(bmi).toBeNull();
    });
  });

  describe('average', () => {
    test('should calculate average correctly for positive numbers', () => {
      // Arrange
      const numbers = [10, 20, 30, 40];

      // Act
      const avg = average(numbers);

      // Assert
      expect(avg).toBe(25);
    });

    test('should handle single number', () => {
      // Arrange
      const numbers = [42];

      // Act
      const avg = average(numbers);

      // Assert
      expect(avg).toBe(42);
    });

    test('should handle decimal numbers', () => {
      // Arrange
      const numbers = [1.5, 2.5, 3.0];

      // Act
      const avg = average(numbers);

      // Assert
      expect(avg).toBe(2.33);
    });

    test('should return 0 for empty array', () => {
      // Arrange
      const numbers = [];

      // Act
      const avg = average(numbers);

      // Assert
      expect(avg).toBe(0);
    });

    test('should handle negative numbers', () => {
      // Arrange
      const numbers = [-10, 0, 10];

      // Act
      const avg = average(numbers);

      // Assert
      expect(avg).toBe(0);
    });
  });

  describe('median', () => {
    test('should calculate median for odd number of elements', () => {
      // Arrange
      const numbers = [1, 3, 5, 7, 9];

      // Act
      const med = median(numbers);

      // Assert
      expect(med).toBe(5);
    });

    test('should calculate median for even number of elements', () => {
      // Arrange
      const numbers = [1, 2, 3, 4];

      // Act
      const med = median(numbers);

      // Assert
      expect(med).toBe(2.5);
    });

    test('should handle unsorted array', () => {
      // Arrange
      const numbers = [3, 1, 4, 1, 5];

      // Act
      const med = median(numbers);

      // Assert
      expect(med).toBe(3); // sorted: [1, 1, 3, 4, 5] -> median = 3
    });

    test('should handle single number', () => {
      // Arrange
      const numbers = [42];

      // Act
      const med = median(numbers);

      // Assert
      expect(med).toBe(42);
    });

    test('should return null for empty array', () => {
      // Arrange
      const numbers = [];

      // Act
      const med = median(numbers);

      // Assert
      expect(med).toBeNull();
    });

    test('should handle decimal numbers', () => {
      // Arrange
      const numbers = [1.1, 2.2, 3.3];

      // Act
      const med = median(numbers);

      // Assert
      expect(med).toBe(2.2);
    });
  });
});

describe('Stats Utils', () => {
  describe('countWins', () => {
    test('should count wins correctly', () => {
      // Arrange
      const matches = [1, 0, 1, 1, 0]; // 3 wins

      // Act
      const wins = countWins(matches);

      // Assert
      expect(wins).toBe(3);
    });

    test('should handle all wins', () => {
      // Arrange
      const matches = [1, 1, 1, 1, 1]; // 5 wins

      // Act
      const wins = countWins(matches);

      // Assert
      expect(wins).toBe(5);
    });

    test('should handle all losses', () => {
      // Arrange
      const matches = [0, 0, 0, 0, 0]; // 0 wins

      // Act
      const wins = countWins(matches);

      // Assert
      expect(wins).toBe(0);
    });

    test('should return 0 for non-array input', () => {
      // Act & Assert
      expect(countWins(null)).toBe(0);
      expect(countWins(undefined)).toBe(0);
      expect(countWins('string')).toBe(0);
      expect(countWins(123)).toBe(0);
    });

    test('should handle empty array', () => {
      // Arrange
      const matches = [];

      // Act
      const wins = countWins(matches);

      // Assert
      expect(wins).toBe(0);
    });
  });

  describe('computeCountryWinRatios', () => {
    test('should compute win ratios correctly', () => {
      // Arrange
      const players = [
        {
          country: { code: 'ESP' },
          data: { last: [1, 1, 1, 0, 0] } // 3/5 = 0.6
        },
        {
          country: { code: 'ESP' },
          data: { last: [1, 1, 0, 0, 0] } // 2/5 = 0.4
        },
        {
          country: { code: 'FRA' },
          data: { last: [1, 0, 0, 0, 0] } // 1/5 = 0.2
        }
      ];

      // Act
      const result = computeCountryWinRatios(players);

      // Assert
      expect(result.best).toEqual([
        { code: 'ESP', winRatio: 0.5 } // (3+2)/(5+5) = 5/10 = 0.5
      ]);
      expect(result.worst).toEqual([
        { code: 'FRA', winRatio: 0.2 } // 1/5 = 0.2
      ]);
    });

    test('should handle players without country code', () => {
      // Arrange
      const players = [
        {
          country: null,
          data: { last: [1, 1, 1, 1, 1] }
        },
        {
          country: { code: 'ESP' },
          data: { last: [1, 0, 0, 0, 0] }
        }
      ];

      // Act
      const result = computeCountryWinRatios(players);

      // Assert
      expect(result.best).toEqual([
        { code: 'ESP', winRatio: 0.2 }
      ]);
      expect(result.worst).toEqual([
        { code: 'ESP', winRatio: 0.2 }
      ]);
    });

    test('should handle empty players array', () => {
      // Arrange
      const players = [];

      // Act
      const result = computeCountryWinRatios(players);

      // Assert
      expect(result.best).toBeNull();
      expect(result.worst).toBeNull();
    });

    test('should handle tied win ratios', () => {
      // Arrange
      const players = [
        {
          country: { code: 'ESP' },
          data: { last: [1, 1, 0, 0, 0] } // 2/5 = 0.4
        },
        {
          country: { code: 'FRA' },
          data: { last: [1, 1, 0, 0, 0] } // 2/5 = 0.4
        }
      ];

      // Act
      const result = computeCountryWinRatios(players);

      // Assert
      expect(result.best).toHaveLength(2);
      expect(result.worst).toHaveLength(2);
      expect(result.best[0].winRatio).toBe(0.4);
      expect(result.worst[0].winRatio).toBe(0.4);
    });

    test('should handle players with no match data', () => {
      // Arrange
      const players = [
        {
          country: { code: 'ESP' },
          data: { last: [] } // no matches = 0/0 = 0
        },
        {
          country: { code: 'FRA' },
          data: null // no data - but will get [] from player.data?.last || []
        }
      ];

      // Act
      const result = computeCountryWinRatios(players);

      // Assert - Both countries have winRatio 0, so both are tied for best and worst
      expect(result.best).toHaveLength(2);
      expect(result.best).toEqual(
        expect.arrayContaining([
          { code: 'ESP', winRatio: 0 },
          { code: 'FRA', winRatio: 0 }
        ])
      );
      expect(result.worst).toHaveLength(2);
      expect(result.worst).toEqual(
        expect.arrayContaining([
          { code: 'ESP', winRatio: 0 },
          { code: 'FRA', winRatio: 0 }
        ])
      );
    });
  });
});