import { Router } from 'express';
import { asyncHandler } from '../lib/async-handler';
import { userId, param, queryParam } from '../lib/params';
import * as users from '../services/users.service';
import * as dashboard from '../services/dashboard.service';
import * as careerDna from '../services/career-dna.service';
import * as careerScore from '../services/career-score.service';
import * as marketValue from '../services/market-value.service';
import * as skillGap from '../services/skill-gap.service';
import * as simulator from '../services/simulator.service';
import * as timeline from '../services/timeline.service';
import * as interview from '../services/interview.service';
import * as memory from '../services/memory.service';
import * as coach from '../services/coach.service';
import * as jobMatch from '../services/job-match.service';
import * as learningRoi from '../services/learning-roi.service';
import * as github from '../services/github.service';
import * as linkedin from '../services/linkedin.service';
import * as risk from '../services/risk.service';
import * as health from '../services/health.service';
import * as share from '../services/share.service';

const router = Router();

router.post('/users/sync', asyncHandler(async (req, res) => {
  res.json(await users.syncUser(req.body));
}));

router.get('/users/:userId', asyncHandler(async (req, res) => {
  res.json(await users.getProfile(userId(req)));
}));

router.put('/users/:userId/profile', asyncHandler(async (req, res) => {
  res.json(await users.updateProfile(userId(req), req.body));
}));

router.get('/dashboard/:userId', asyncHandler(async (req, res) => {
  res.json(await dashboard.getOverview(userId(req)));
}));

router.get('/career-dna/:userId', asyncHandler(async (req, res) => {
  res.json(await careerDna.compute(userId(req)));
}));

router.get('/career-score/:userId', asyncHandler(async (req, res) => {
  res.json(await careerScore.compute(userId(req)));
}));

router.get('/market-value/:userId', asyncHandler(async (req, res) => {
  res.json(await marketValue.compute(userId(req)));
}));

router.get('/skill-gap/:userId', asyncHandler(async (req, res) => {
  const targetRole = queryParam(req.query.targetRole);
  if (!targetRole) {
    res.status(400).json({ error: 'targetRole query parameter is required' });
    return;
  }
  res.json(await skillGap.analyze(userId(req), targetRole));
}));

router.post('/simulator/:userId', asyncHandler(async (req, res) => {
  res.json(await simulator.simulate(userId(req), req.body));
}));

router.get('/simulator/:userId/history', asyncHandler(async (req, res) => {
  res.json(await simulator.getHistory(userId(req)));
}));

router.get('/timeline/:userId', asyncHandler(async (req, res) => {
  res.json(await timeline.predict(userId(req)));
}));

router.get('/interview/:userId/predictions', asyncHandler(async (req, res) => {
  res.json(await interview.predict(userId(req)));
}));

router.post('/memory/:userId', asyncHandler(async (req, res) => {
  res.json(await memory.create(userId(req), req.body));
}));

router.get('/memory/:userId/search', asyncHandler(async (req, res) => {
  res.json(await memory.search(userId(req), queryParam(req.query.q)));
}));

router.get('/memory/:userId', asyncHandler(async (req, res) => {
  res.json(await memory.getTimeline(userId(req)));
}));

router.get('/coach/agents', asyncHandler(async (_req, res) => {
  res.json(coach.getAgents());
}));

router.post('/coach/:userId/chat', asyncHandler(async (req, res) => {
  const { messages, agent } = req.body;
  res.json(await coach.chat(userId(req), messages, agent));
}));

router.get('/job-match/:userId', asyncHandler(async (req, res) => {
  res.json(await jobMatch.match(userId(req)));
}));

router.get('/learning-roi/:userId', asyncHandler(async (req, res) => {
  res.json(await learningRoi.compute(userId(req)));
}));

router.get('/github/:userId', asyncHandler(async (req, res) => {
  res.json(await github.analyze(userId(req), queryParam(req.query.username) || undefined));
}));

router.get('/linkedin/:userId', asyncHandler(async (req, res) => {
  res.json(await linkedin.analyze(userId(req)));
}));

router.get('/risk/:userId', asyncHandler(async (req, res) => {
  res.json(await risk.detect(userId(req)));
}));

router.get('/health/:userId', asyncHandler(async (req, res) => {
  res.json(await health.compute(userId(req)));
}));

router.post('/share/:userId', asyncHandler(async (req, res) => {
  const { type, title, data } = req.body;
  res.json(await share.create(userId(req), type, title, data));
}));

router.get('/share/card/:shareUrl', asyncHandler(async (req, res) => {
  res.json(await share.get(param(req.params.shareUrl)));
}));

router.get('/share/:userId', asyncHandler(async (req, res) => {
  res.json(await share.list(userId(req)));
}));

export default router;
