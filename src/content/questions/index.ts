import { QuestionPack } from '@/engine/types';
import chatroomRole from './chatroom_role.json';
import workMeeting from './work_meeting.json';

const packs: Record<string, QuestionPack> = {
  'chatroom-role-test': chatroomRole as QuestionPack,
  'work-meeting-type': workMeeting as QuestionPack,
};

export function getQuestionPack(slug: string): QuestionPack | undefined {
  return packs[slug];
}
