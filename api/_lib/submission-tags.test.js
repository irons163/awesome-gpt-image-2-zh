import test from 'node:test';
import assert from 'node:assert/strict';
import {validateTags,formatTags,parseTags} from './submission-tags.js';
const tags={category:'Illustration & Art',styles:['Illustration','Realistic'],scenes:['Travel','Education']};
test('submission tags survive issue formatting and import without losing multiple selections',()=>{
  assert.deepEqual(parseTags('intro\n\n'+formatTags(tags)+'\n\nconsent'),tags);
  assert.deepEqual(validateTags({...tags,styles:['Illustration','Illustration']}),{...tags,styles:['Illustration']});
});
test('submission tags reject unknown, missing or malformed selections',()=>{
  for(const change of [{category:'spam'},{styles:[]},{scenes:[]},{styles:'Illustration'},{styles:['injected']},{scenes:[{}]},{category:null}]) assert.throws(()=>validateTags({...tags,...change}));
  assert.throws(()=>parseTags('### 分類與標籤\n\n    invalid\n\n### 投稿聲明'));
});
test('old issues keep a reviewable fallback classification',()=>{
  assert.deepEqual(parseTags('### 投稿者\n\n    someone'),{category:'Other Use Cases',styles:['Community'],scenes:['Creative']});
});
