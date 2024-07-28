import { Prisma } from '@prisma/client';

const asyncHandler = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (e) {
      if (
        e.name === 'StructError' ||
        e instanceof Prisma.PrismaClientValidationError
      ) {
        res.status(400).json({ message: e.message });
      } else if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        res.status(404).json({ message: 'Resource not found' });
      } else {
        res.status(500).json({ message: e.message });
      }
      next(e); // 추가적으로 에러 핸들러로 전달
    }
  };
}

export default asyncHandler;
