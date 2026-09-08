import {parseTags} from '../api/_lib/submission-tags.js';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const repo = 'irons163/awesome-gpt-image-2-zh';
const gh = (...args) => execFileSync('gh', args, { encoding: 'utf8' }).trim();
const number = process.env.ISSUE_NUMBER;
if (!/^\d+$/.test(number || '')) throw new Error('Invalid issue number');
const issue = JSON.parse(gh('api', `repos/${repo}/issues/${number}`));
if (issue.user.login !== 'phil-image-gallery-submissions[bot]' || !issue.labels.some(l => l.name === 'approved') || issue.state !== 'open') throw new Error('Not an approved bot submission');
const field = (heading, next) => {
  const start = issue.body.indexOf(`### ${heading}\n\n`);
  const end = issue.body.indexOf(`\n\n### ${next}`, start);
  if (start < 0 || end < 0) throw new Error('Invalid submission format');
  return issue.body.slice(start + `### ${heading}\n\n`.length, end).split('\n').map(l => {
    if (!l.startsWith('    ')) throw new Error('Invalid literal field');
    return l.slice(4);
  }).join('\n');
};
const image = issue.body.match(/!\[\]\((https:\/\/gpt-image2\.zero2codex\.dev\/api\/submission-image\?id=([a-f0-9-]{36}\.(?:png|jpg)))\)/);
if (!image) throw new Error('Invalid image URL');
const response = await fetch(image[1], {redirect:'error', signal:AbortSignal.timeout(20000)});
if (!response.ok) throw new Error('Image unavailable');
const chunks=[]; let size=0;
for await (const chunk of response.body) { size+=chunk.length; if(size>3*1024*1024) throw new Error('Image too large'); chunks.push(chunk); }
const bytes=Buffer.concat(chunks);
if (!(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) || (bytes[0]===255 && bytes[1]===216 && bytes[2]===255))) throw new Error('Invalid image');
const id=1000000+Number(number);
const filename=`data/submissions/issue-${number}.json`;
if (existsSync(filename)) throw new Error('Submission already imported');
const prompt=field('提示詞','來源／個人連結');
const title=issue.title.replace(/^\[投稿\]\s*/, '');
const imagePath=`/images/submissions/issue-${number}.${image[2].split('.').pop()}`;
const item={id,title,image:imagePath,imageAlt:title,sourceLabel:field('投稿者','使用模型'),sourceUrl:issue.html_url,contributorUrl:field('來源／個人連結','成果圖片'),model:field('使用模型','提示詞'),prompt,promptZh:prompt,promptPreview:prompt.replace(/\n+/g,' ').slice(0,220),promptPreviewZh:prompt.replace(/\n+/g,' ').slice(0,220),...parseTags(issue.body),featured:false,githubUrl:issue.html_url,localGithubUrl:issue.html_url,submissionIssue:Number(number)};
mkdirSync('data/images/submissions',{recursive:true}); mkdirSync('data/submissions',{recursive:true});
writeFileSync('data'+imagePath,bytes);
writeFileSync(filename,JSON.stringify(item,null,2)+'\n');
console.log(`Imported issue ${number}; review title, Taiwan terminology, category and image in PR.`);
