// src/common/interceptors/response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// @Injectable()
// export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     return next.handle().pipe(
//       map((data) => {
//         // Dynamically check if data is "truthy" (you can customize logic)
//         const success = data !== null && data !== undefined && data !== false;

//         // Optionally get the route name or class name
//         const ctx = context.switchToHttp();
//         const request = ctx.getRequest();
//         const handlerName = context.getHandler().name;

//         return {
//           success,
//           message: `${handlerName} executed successfully`,
//           data,
//         };
//       }),
//     );
//   }
// }


@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    // ✅ THIS GOES INSIDE THE INTERCEPT METHOD
    if (request.url.startsWith('/uploads/')) {
      return next.handle();
    }
    
    return next.handle().pipe(
      map((data) => {
        // Your existing logic...
        const success = data !== null && data !== undefined && data !== false;
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const handlerName = context.getHandler().name;

        return {
          success,
          message: `${handlerName} executed successfully`,
          data,
        };
      }),
    );
  }
}