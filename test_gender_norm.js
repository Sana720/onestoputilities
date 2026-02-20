const normalizeGender = (gender) => {
    const g = (gender || '').trim().toLowerCase();
    if (g.startsWith('m')) return 'Male';
    if (g.startsWith('f')) return 'Female';
    if (g.startsWith('o')) return 'Other';
    return 'Male'; // Default
};

const testCases = [
    { input: 'Male', expected: 'Male' },
    { input: 'Female', expected: 'Female' },
    { input: 'male', expected: 'Male' },
    { input: 'FEMALE', expected: 'Female' },
    { input: '  Other  ', expected: 'Other' },
    { input: 'm', expected: 'Male' },
    { input: 'F', expected: 'Female' },
    { input: '', expected: 'Male' },
    { input: null, expected: 'Male' },
    { input: 'unknown', expected: 'Male' }
];

testCases.forEach(({ input, expected }) => {
    const result = normalizeGender(input);
    console.log(`Input: "${input}", Result: "${result}", ${result === expected ? 'PASS' : 'FAIL'}`);
});
