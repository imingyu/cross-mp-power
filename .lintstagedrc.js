module.exports = {
    '*.js': ['eslint'],
    '*.ts': ['eslint', 'tsc --noEmit ./src/self.d.ts']
};
