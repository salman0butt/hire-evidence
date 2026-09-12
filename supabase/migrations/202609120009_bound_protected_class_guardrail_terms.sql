create or replace function private.assert_interviewer_guardrails(
  p_job_text text,
  p_guidelines text,
  p_candidate_instructions text
)
returns void
language plpgsql
set search_path = ''
as $$
declare
  v_text text := lower(concat_ws(
    E'\n',
    coalesce(p_job_text, ''),
    coalesce(p_guidelines, ''),
    coalesce(p_candidate_instructions, '')
  ));
begin
  if v_text ~ '(^|[^[:alnum:]_])(race|racial|religion|religious|gender|sex|sexual orientation|ethnicity|ethnic|nationality|national origin|age)([^[:alnum:]_]|$)' then
    raise exception 'Interviewer configuration conflicts with protected-class hiring rules.' using errcode = '22023';
  end if;

  if v_text ~ '(disability|disabled|medical condition|medical history|health condition|mental health|diagnosis)' then
    raise exception 'Interviewer configuration conflicts with disability or medical hiring rules.' using errcode = '22023';
  end if;

  if v_text ~ '(pregnant|pregnancy|marital status|married|children|childcare|family status|family plans)' then
    raise exception 'Interviewer configuration conflicts with pregnancy or family-status hiring rules.' using errcode = '22023';
  end if;

  if v_text ~ '(facial expression|face analysis|facial analysis|emotion detection|emotion recognition|biometric|appearance|looks attractive)' then
    raise exception 'Interviewer configuration conflicts with biometric or emotion-inference hiring rules.' using errcode = '22023';
  end if;

  if v_text ~ '(lie detection|lie detector|detect lies|deception detection|detect deception|judge honesty from)' then
    raise exception 'Interviewer configuration conflicts with deception-detection hiring rules.' using errcode = '22023';
  end if;

  if v_text ~ '(accent|native sounding|native-sounding|sounds native|sound native)' then
    raise exception 'Interviewer configuration conflicts with accent-bias hiring rules.' using errcode = '22023';
  end if;

  if v_text ~ '(introvert|introverts|extrovert|extroverts|personality|personality type|personality test|personality fit)' then
    raise exception 'Interviewer configuration conflicts with personality-proxy hiring rules.' using errcode = '22023';
  end if;

  if (
    v_text ~ '(automatically|autonomously|without human review).{0,40}(reject|hire|decline|disqualify)'
    or v_text ~ '(reject|hire|decline|disqualify).{0,40}(automatically|autonomously|without human review)'
  ) then
    raise exception 'Interviewer configuration cannot make autonomous hiring decisions without human review.' using errcode = '22023';
  end if;

  if (
    v_text ~ 'ignore.{0,40}(platform|safety|fairness).{0,20}(rule|rules|policy|policies|restriction|restrictions)'
    or v_text ~ '(override|bypass|disable).{0,30}(platform|safety|fairness).{0,20}(rule|rules|policy|policies|guardrail|guardrails)'
  ) then
    raise exception 'Interviewer configuration cannot override, bypass, or disable platform safety rules.' using errcode = '22023';
  end if;
end;
$$;

revoke all on function private.assert_interviewer_guardrails(text, text, text) from public;
revoke all on function private.assert_interviewer_guardrails(text, text, text) from anon;
revoke all on function private.assert_interviewer_guardrails(text, text, text) from authenticated;
