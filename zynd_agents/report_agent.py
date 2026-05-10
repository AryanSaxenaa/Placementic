from zyndai_agent.agent import ZyndAIAgent, AgentConfig
from report_builder import build_report
import json

config = AgentConfig(name="report-agent", webhook_port=5003)
agent = ZyndAIAgent(agent_config=config)

async def handle_message(message):
    data = json.loads(message.content)
    result = await build_report(
        data["resume"],
        data["jd"],
        data["glassdoor"],
        data["ambitionbox"],
        data["linkedin"],
        data["college"]
    )
    return json.dumps(result)

agent.add_message_handler(handle_message)
