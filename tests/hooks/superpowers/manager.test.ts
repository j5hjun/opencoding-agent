import { describe, expect, it, beforeEach } from 'bun:test';
import { superpowersManager } from '../../../src/hooks/superpowers/manager';

describe('SuperpowersManager', () => {
  const sessionID = 'test-session';

  beforeEach(() => {
    superpowersManager.clear(sessionID);
  });

  describe('Approval Management', () => {
    it('should approve a topic', () => {
      superpowersManager.approve(sessionID, 'brainstorming');
      expect(superpowersManager.isApproved(sessionID, 'brainstorming')).toBe(true);
    });

    it('should return false if topic is not approved', () => {
      expect(superpowersManager.isApproved(sessionID, 'unknown')).toBe(false);
    });
  });

  describe('TDD State Management', () => {
    it('should mark a test as failed', () => {
      const testPath = 'tests/example.test.ts';
      superpowersManager.markAsFailed(sessionID, testPath);
      expect(superpowersManager.isFailed(sessionID, testPath)).toBe(true);
    });

    it('should mark a test as passed (set to passed status)', () => {
      const testPath = 'tests/example.test.ts';
      superpowersManager.markAsFailed(sessionID, testPath);
      superpowersManager.markAsPassed(sessionID, testPath);
      expect(superpowersManager.isFailed(sessionID, testPath)).toBe(false);
      expect(superpowersManager.getTDDStatus(sessionID, testPath)).toBe('passed');
    });

    it('should return correct status via getTDDStatus', () => {
      const testPath = 'tests/example.test.ts';
      expect(superpowersManager.getTDDStatus(sessionID, testPath)).toBeUndefined();
      
      superpowersManager.markAsFailed(sessionID, testPath);
      expect(superpowersManager.getTDDStatus(sessionID, testPath)).toBe('failed');
      
      superpowersManager.markAsPassed(sessionID, testPath);
      expect(superpowersManager.getTDDStatus(sessionID, testPath)).toBe('passed');
    });

    it('should return false if test never failed', () => {
      expect(superpowersManager.isFailed(sessionID, 'unknown.test.ts')).toBe(false);
    });
  });

  describe('Session Cleanup', () => {
    it('should clear all state for a session', () => {
      superpowersManager.approve(sessionID, 'topic');
      superpowersManager.markAsFailed(sessionID, 'test.ts');
      
      superpowersManager.clear(sessionID);
      
      expect(superpowersManager.isApproved(sessionID, 'topic')).toBe(false);
      expect(superpowersManager.isFailed(sessionID, 'test.ts')).toBe(false);
    });
  });

  describe('Session Isolation', () => {
    it('should isolate states between different sessions', () => {
      const sessionA = 'session-a';
      const sessionB = 'session-b';
      
      superpowersManager.approve(sessionA, 'topicA');
      superpowersManager.markAsFailed(sessionA, 'testA.ts');
      
      expect(superpowersManager.isApproved(sessionB, 'topicA')).toBe(false);
      expect(superpowersManager.isFailed(sessionB, 'testA.ts')).toBe(false);
      
      superpowersManager.approve(sessionB, 'topicB');
      expect(superpowersManager.isApproved(sessionA, 'topicB')).toBe(false);
    });
  });
});
