// Copyright (c) 2017 VMware, Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { AuditLog } from './audit-log';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

export const logEndpoint = "/api/logs";

@Injectable()
export class AuditLogService {
  httpOptions = new RequestOptions({
    headers: new Headers({
      "Content-Type": 'application/json',
      "Accept": 'application/json'
    })
  });

  constructor(private http: Http) {}

  listAuditLogs(queryParam: AuditLog): Observable<any> {
    let params: URLSearchParams = new URLSearchParams(queryParam.keywords);
    params.set('begin_timestamp', <string>queryParam.begin_timestamp);    
    params.set('end_timestamp', <string>queryParam.end_timestamp);
    params.set('username', queryParam.username);
    params.set('page', <string>queryParam.page);
    params.set('page_size', <string>queryParam.page_size);
    return this.http
      .get(`/api/projects/${queryParam.project_id}/logs`, {params: params})
      .map(response => response)
      .catch(error => Observable.throw(error));
  }

  getRecentLogs(lines: number): Observable<AuditLog[]> {
    return this.http.get(logEndpoint + "?page_size=" + lines, this.httpOptions)
      .map(response => response.json() as AuditLog[])
      .catch(error => Observable.throw(error));
  }
}