import { FileDatabase } from './FileDatabase.ts';
import { v4 as uuidV4 } from 'uuid';

describe(FileDatabase.name, () => {
  describe(FileDatabase.new.name, () => {
    it('should create a new instance of FileDatabase', () => {
      // Arrange + Act
      const fileDatabase = FileDatabase.new();
      
      // Assert
      expect(fileDatabase).toBeInstanceOf(FileDatabase);
    });
  });

  describe(FileDatabase.prototype.read.name, () => {
    describe('formSchema', () => {
      it('should return all records with a universal query', () => {
        // Arrange
        const fileDatabase = FileDatabase.new();
        [
          {
            seriesId: '123',
            revision: 0,
            name: 'Test Form',
            description: 'Test Form Description'
          },
          {
            seriesId: '456',
            revision: 0,
            name: 'Test Form 2',
            description: 'Test Form Description 2'
          }
        ].map(formSchema => fileDatabase.create('formSchema', formSchema));
    
        // Act
        const result = fileDatabase.read('formSchema', () => true);

        // Assert
        if (result.isErr()) {
          throw result.error;
        }
        expect(result.isOk()).toBe(true);
        expect(result.value.length).toBe(2);
      });

      it('should return a single record with a specific query', () => {
        // Arrange
        const fileDatabase = FileDatabase.new();
        [
          {
            seriesId: '123',
            revision: 0,
            name: 'Test Form',
            description: 'Test Form Description'
          },
          {
            seriesId: '456',
            revision: 0,
            name: 'Test Form 2',
            description: 'Test Form Description 2'
          }
        ].map(formSchema => fileDatabase.create('formSchema', formSchema));
    
        // Act
        const result = fileDatabase.read('formSchema', 
          (row) => row.seriesId === '123' && row.revision === 0
        );

        // Assert
        if (result.isErr()) {
          throw result.error;
        }
        expect(result.isOk()).toBe(true);
        expect(result.value.length).toBe(1);
        expect(result.value.at(0)?.seriesId).toBe('123');
        expect(result.value.at(0)?.revision).toBe(0);
      });
    });
  });

  describe(FileDatabase.prototype.create.name, () => {
    describe('formSchema', () => {
      it('should create a new record in the table', () => {
        // Arrange
        const fileDatabase = FileDatabase.new();
        const newFormSchema = {
          seriesId: uuidV4(),
          revision: 0,
          name: 'Test Form',
          description: 'Test Form Description'
        };
  
        // Act
        const result = fileDatabase.create('formSchema', newFormSchema);
        
        // Assert
        expect(result.isOk()).toBe(true);
      });
  
      it('should return a PrimaryKeyError if the record already exists', () => {
        // Arrange
        const fileDatabase = FileDatabase.new();
        const formSchema = {
          seriesId: '123',
          revision: 0,
          name: 'Test Form',
          description: 'Test Form Description'
        };
        fileDatabase.create('formSchema', formSchema);

        // Act
        const result = fileDatabase.create('formSchema', formSchema);

        // Assert
        if (result.isOk()) {
          throw 'Expected a PrimaryKeyError';
        }
        expect(result.error.type).toBe('PrimaryKeyError');
      });
    });
  });

  describe(FileDatabase.prototype.revise.name, () => {
    describe('formSchema', () => {
      it('should update an existing record in the table', () => {
        // Arrange
        const fileDatabase = FileDatabase.new();
        const formSchema = {
          seriesId: '123',
          revision: 0,
          name: 'Test Form',
          description: 'Test Form Description'
        };
        fileDatabase.create('formSchema', formSchema);

        // Act
        const result = fileDatabase.revise('formSchema', {
          seriesId: '123',
          description: 'New Description'
        });

        // Assert
        const readResult = fileDatabase.read('formSchema', 
          row => row.revision === 1
        );

        if (result.isErr()) {
          throw result.error;
        }

        if (readResult.isErr()) {
          throw readResult.error;
        }

        expect(readResult.value.length).toBe(1);
        expect(readResult.value.at(0)?.description).toBe('New Description');
        expect(readResult.value.at(0)?.revision).toBe(1);
      });

      it('should return a NotFoundError if the record does not exist', () => {
        // Arrange
        const fileDatabase = FileDatabase.new();
        
        // Act
        const result = fileDatabase.revise('formSchema', {
          seriesId: '123',
          description: 'New Description'
        });

        // Assert
        if (result.isOk()) {
          throw 'Expected a NotFoundError';
        }
        expect(result.error.type).toBe('NotFoundError');
      });
    });
  });
});