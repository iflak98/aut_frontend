module.exports = `// @ts-nocheck
import { async,TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of as observableOf, throwError } from 'rxjs';

<%- importMocks.join('\\n') -%>

<%- providerMocks.mocks.join('\\n') %>

describe('<%- className %>', () => {
  let service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[
        <%- providerMocks.providers.join(',\\n          ') %>

      ]
    })
    service = TestBed.inject(<%- className %>);
  });

  <% for(var key in functionTests) { -%>
  <%- functionTests[key] -%>
  <% } -%>

});`
