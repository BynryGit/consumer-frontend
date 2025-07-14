// export class QueryStringParameters {
//   private params: Map<string, string> = new Map();

//   push(key: string, value: string): void {
//     this.params.set(key, value);
//   }

//   toString(): string {
//     const params: string[] = [];
//     this.params.forEach((value, key) => {
//       params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
//     });
//     return params.length ? `?${params.join('&')}` : '';
//   }
// }

export class QueryStringParameters {
  private params: URLSearchParams = new URLSearchParams();

  push(key: string, value: any): void {
    this.params.append(key, value); // ✅ append instead of set
  }
  toString(): string {
    const query = this.params.toString();
    return query ? `?${query}` : '';
  }
}


export class UrlBuilder {
  public queryString: QueryStringParameters;

  constructor(private baseUrl: string, private action: string) {
    this.queryString = new QueryStringParameters();
  }

  toString(): string {
    return `${this.baseUrl}${this.action}${this.queryString.toString()}`;
  }
}
