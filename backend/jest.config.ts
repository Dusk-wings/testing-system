import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',

    roots: ['<rootDir>/test'],

    testMatch: [
        '**/*.test.ts'
    ],

    moduleFileExtensions: ['ts', 'js'],

    moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/src/$1'
    },

    clearMocks: true,
};

export = config;
