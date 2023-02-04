export type JestMockedFunction<T extends (...args: any) => any> = jest.Mock<
  ReturnType<T>,
  Parameters<T>
>;
