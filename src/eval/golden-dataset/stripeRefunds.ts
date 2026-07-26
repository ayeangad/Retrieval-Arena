import type { GoldenExample } from "../../types";

export const stripeRefunds: GoldenExample[] = [
  {
    "id": "q01",
    "documentId": "doc-2-stripe-3.md",
    "query": "Can I issue a refund that exceeds the total of the original charge amount?",
    "queryType": "factual",
    "expectedAnswer": "No, while you can issue more than one refund against a charge, you cannot refund a total greater than the original charge amount.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 2361,
        "charEnd": 2425
      }
    ]
  },
  {
    "id": "q02",
    "documentId": "doc-2-stripe-3.md",
    "query": "How long does it take for a failed refund to be added back to my Stripe balance?",
    "queryType": "factual",
    "expectedAnswer": "The process of a bank returning the refunded amount to your Stripe account balance can take up to 30 days from the post date.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 8773,
        "charEnd": 8828
      }
    ]
  },
  {
    "id": "q03",
    "documentId": "doc-2-stripe-3.md",
    "query": "What happens if a refund is sent to an expired or canceled card?",
    "queryType": "factual",
    "expectedAnswer": "Refunds to expired or canceled cards are handled by the customer's card issuer and are typically credited to the customer's replacement card. If there is no replacement, the issuer usually delivers the refund via an alternate method like a check or bank deposit.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 6711,
        "charEnd": 6867
      }
    ]
  },
  {
    "id": "q04",
    "documentId": "doc-2-stripe-3.md",
    "query": "For which specific payment methods is there a risk of a double refund if the customer's bank initiates a dispute?",
    "queryType": "factual",
    "expectedAnswer": "Bank debit payment methods such as SEPA Direct Debit, Bacs Direct Debit, ACH Direct Debit, ACSS (Canadian PADs), AU BECS Direct Debit, and NZ bank account debits carry a risk of a double refund.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 8205,
        "charEnd": 8237
      }
    ]
  },
  {
    "id": "q05",
    "documentId": "doc-2-stripe-3.md",
    "query": "How can a user resolve a negative Stripe balance?",
    "queryType": "factual",
    "expectedAnswer": "A negative Stripe balance can be resolved by collecting payments or topping up the account balance. In some regions, Stripe might also automatically debit your bank accounts to recover the balance.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 768,
        "charEnd": 840
      }
    ]
  },
  {
    "id": "q06",
    "documentId": "doc-2-stripe-3.md",
    "query": "Under what exact conditions will Stripe send an email to a customer notifying them of a refund?",
    "queryType": "factual",
    "expectedAnswer": "Stripe sends an email if: 1) The original charge was created on a customer in your Stripe account, 2) The customer has a stored email address, and 3) You enabled 'Email customers for refunds' in the Dashboard.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 1590,
        "charEnd": 1665
      }
    ]
  },
  {
    "id": "q07",
    "documentId": "doc-2-stripe-3.md",
    "query": "When a refund is successfully canceled, what status does it transition to?",
    "queryType": "factual",
    "expectedAnswer": "Cancelled refunds transition to a 'canceled' status.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 13712,
        "charEnd": 13764
      }
    ]
  },
  {
    "id": "q08",
    "documentId": "doc-2-stripe-3.md",
    "query": "Can a PaymentIntent be canceled after it has succeeded?",
    "queryType": "factual",
    "expectedAnswer": "No, a PaymentIntent cannot be canceled after it has succeeded.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 23141,
        "charEnd": 23199
      }
    ]
  },
  {
    "id": "q09",
    "documentId": "doc-2-stripe-3.md",
    "query": "What action does Stripe recommend if a customer disputes a charge while a refund is still pending?",
    "queryType": "factual",
    "expectedAnswer": "Stripe recommends accepting or challenging the dispute instead of refunding, to avoid duplicate reimbursements to the customer.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 9920,
        "charEnd": 9979
      }
    ]
  },
  {
    "id": "q10",
    "documentId": "doc-2-stripe-3.md",
    "query": "What information does the next_action property contain when a refund has a requires_action status?",
    "queryType": "factual",
    "expectedAnswer": "The next_action property describes what the refund needs to continue processing, including the type of next action, information about the email sent to the customer, and the timestamp when the refund request expires.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 15224,
        "charEnd": 15350
      }
    ]
  },
  {
    "id": "q11",
    "documentId": "doc-2-stripe-3.md",
    "query": "What do the acronyms ARN, STAN, and RRN stand for in the context of tracing a refund?",
    "queryType": "keyword",
    "expectedAnswer": "ARN stands for Acquirer Reference Number, STAN stands for System Trace Audit Number, and RRN stands for Retrieval Reference Number.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 19348,
        "charEnd": 19458
      }
    ]
  },
  {
    "id": "q12",
    "documentId": "doc-2-stripe-3.md",
    "query": "What does the 'charge_for_pending_refund_disputed' failure reason indicate?",
    "queryType": "keyword",
    "expectedAnswer": "It indicates that a customer disputed the charge while the refund was pending.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 9920,
        "charEnd": 9979
      }
    ]
  },
  {
    "id": "q13",
    "documentId": "doc-2-stripe-3.md",
    "query": "Who does Stripe debit for refunds associated with an 'on_behalf_of' payment?",
    "queryType": "keyword",
    "expectedAnswer": "Stripe debits your platform for refunds to separate charge and transfer payments, with or without on_behalf_of.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 5898,
        "charEnd": 6013
      }
    ]
  },
  {
    "id": "q14",
    "documentId": "doc-2-stripe-3.md",
    "query": "Which exact webhook event is sent when funds are reinstated to your account after a dispute is closed?",
    "queryType": "keyword",
    "expectedAnswer": "The 'charge.dispute.funds_reinstated' event is sent.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 24688,
        "charEnd": 24796
      }
    ]
  },
  {
    "id": "q15",
    "documentId": "doc-2-stripe-3.md",
    "query": "In the destination_details hash, what does the network_decline_code field indicate?",
    "queryType": "keyword",
    "expectedAnswer": "It provides the decline code from financial partners, which indicates the reason the refund failed.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 12001,
        "charEnd": 12148
      }
    ]
  },
  {
    "id": "q16",
    "documentId": "doc-2-stripe-3.md",
    "query": "How is the refund process different for a PaymentIntent that has a status of 'requires_capture'?",
    "queryType": "keyword",
    "expectedAnswer": "The charge attached to the PaymentIntent remains uncaptured and cannot be refunded directly. Instead, you must cancel the PaymentIntent.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 4974,
        "charEnd": 5061
      }
    ]
  },
  {
    "id": "q17",
    "documentId": "doc-2-stripe-3.md",
    "query": "What timestamp is stored in the 'email_sent_at' field during a refund?",
    "queryType": "keyword",
    "expectedAnswer": "It stores the timestamp when the email was sent to the customer requesting their bank information.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 15541,
        "charEnd": 15596
      }
    ]
  },
  {
    "id": "q18",
    "documentId": "doc-2-stripe-3.md",
    "query": "Why might 'IC+' users see a difference in cost between reversals and refunds?",
    "queryType": "keyword",
    "expectedAnswer": "Because reversals usually incur lower network fees.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 17529,
        "charEnd": 17571
      }
    ]
  },
  {
    "id": "q19",
    "documentId": "doc-2-stripe-3.md",
    "query": "What value is returned in destination_details[card][type] when verifying a reversal via the API?",
    "queryType": "keyword",
    "expectedAnswer": "It returns 'reversal'.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 18189,
        "charEnd": 18235
      }
    ]
  },
  {
    "id": "q20",
    "documentId": "doc-2-stripe-3.md",
    "query": "If the associated payment method is 'US Bank Account', what specific PaymentIntent status allows for cancellation?",
    "queryType": "keyword",
    "expectedAnswer": "It can be canceled when it has a status of 'processing'.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 23066,
        "charEnd": 23139
      }
    ]
  },
  {
    "id": "q21",
    "documentId": "doc-2-stripe-3.md",
    "query": "What should I do if a buyer wants their cash sent back to a totally different checking account than the one they initially used?",
    "queryType": "semantic",
    "expectedAnswer": "You cannot do this. Refunds can only be sent back to the original payment method used in a charge, and cannot be sent to a different destination.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 6441,
        "charEnd": 6570
      }
    ]
  },
  {
    "id": "q22",
    "documentId": "doc-2-stripe-3.md",
    "query": "Is there a way to give back only a portion of the payment to multiple customers at once through the user interface?",
    "queryType": "semantic",
    "expectedAnswer": "No, the Dashboard's bulk refund feature only supports full refunds. Partial refunds must be issued individually.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 3434,
        "charEnd": 3523
      }
    ]
  },
  {
    "id": "q23",
    "documentId": "doc-2-stripe-3.md",
    "query": "If I realize I made a mistake right after initiating a reimbursement, is it possible to stop it from going through to the buyer?",
    "queryType": "semantic",
    "expectedAnswer": "Yes, depending on the refund type, you might be able to cancel it before it reaches the customer, provided it hasn't been processed as a charge reversal.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 13020,
        "charEnd": 13067
      }
    ]
  },
  {
    "id": "q24",
    "documentId": "doc-2-stripe-3.md",
    "query": "How can I avoid paying transaction fees on transactions that I end up deciding not to fulfill?",
    "queryType": "semantic",
    "expectedAnswer": "You can use manual authorization and capture, which allows you to cancel payments before they are captured, reducing costs compared to processing a refund.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 25969,
        "charEnd": 26148
      }
    ]
  },
  {
    "id": "q25",
    "documentId": "doc-2-stripe-3.md",
    "query": "Will the buyer still see the original purchase and a separate incoming credit if I drop the transaction immediately after it happens?",
    "queryType": "semantic",
    "expectedAnswer": "No, refunds issued shortly after the charge appear as a reversal. The original charge simply drops off the statement and no separate credit is issued.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 18593,
        "charEnd": 18694
      }
    ]
  },
  {
    "id": "q26",
    "documentId": "doc-2-stripe-3.md",
    "query": "If a customer paid with Konbini, why might the reimbursement process stall and wait for input?",
    "queryType": "semantic",
    "expectedAnswer": "Because Konbini lacks native refund support, Stripe must email the customer to collect their bank account details before the refund can be processed, placing the refund in a requires_action status.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 14746,
        "charEnd": 14950
      }
    ]
  },
  {
    "id": "q27",
    "documentId": "doc-2-stripe-3.md",
    "query": "Where can I find the tracking ID to give to a customer who is wondering where their money is?",
    "queryType": "semantic",
    "expectedAnswer": "You can find the reference number (like an ARN or STAN) by opening the payment details page in the Dashboard and clicking 'View Details' on the refund entry in the Timeline, or by retrieving it via the API.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 20623,
        "charEnd": 20669
      }
    ]
  },
  {
    "id": "q28",
    "documentId": "doc-2-stripe-3.md",
    "query": "My customer's bank account was closed and the returned money bounced back. What happens to those funds?",
    "queryType": "semantic",
    "expectedAnswer": "The bank returns the refunded amount to Stripe, and Stripe adds it back to your Stripe account balance.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 18817,
        "charEnd": 18912
      }
    ]
  },
  {
    "id": "q29",
    "documentId": "doc-2-stripe-3.md",
    "query": "I am utilizing Stripe's automated tax feature to log my sales. Do I need to do anything special when giving money back?",
    "queryType": "semantic",
    "expectedAnswer": "Yes, if you are using Stripe Tax APIs to record sales, you must also record the refunds.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 4077,
        "charEnd": 4124
      }
    ]
  },
  {
    "id": "q30",
    "documentId": "doc-2-stripe-3.md",
    "query": "If my system routes money to a secondary connected seller and a subsequent reimbursement bounces, whose account absorbs the returned funds?",
    "queryType": "semantic",
    "expectedAnswer": "If your platform uses Connect with destination charges, the funds from a failed refund are deposited to your platform account's Stripe balance.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 12867,
        "charEnd": 12944
      }
    ]
  },
  {
    "id": "q31",
    "documentId": "doc-2-stripe-3.md",
    "query": "If I cancel an uncaptured payment, does doing so return the original Stripe processing fees, and can I continue to use that PaymentIntent to charge the customer later?",
    "queryType": "multi-hop",
    "expectedAnswer": "Canceling an uncaptured payment costs nothing (unlike a post-capture refund where fees aren't returned). However, once canceled, you can no longer use the PaymentIntent to perform additional charges.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 174,
        "charEnd": 206
      },
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 23235,
        "charEnd": 23289
      }
    ]
  },
  {
    "id": "q32",
    "documentId": "doc-2-stripe-3.md",
    "query": "If a refund fails because the customer's account lacked funds and the expiry window passed, what failure reason is assigned, and what status does the refund transition to?",
    "queryType": "factual",
    "expectedAnswer": "The failure reason assigned is 'insufficient_funds', and the Refund object's status transitions to 'failed'.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 10792,
        "charEnd": 10924
      }
    ]
  },
  {
    "id": "q33",
    "documentId": "doc-2-stripe-3.md",
    "query": "If I am trying to minimize refund costs and decide to leave a PaymentIntent uncaptured, what API endpoint do I call to abort it, and what happens if the payment method was a US Bank Account?",
    "queryType": "multi-hop",
    "expectedAnswer": "You would call the POST /v1/payment_intents/{{PAYMENTINTENT_ID}}/cancel endpoint. If the payment method is a US Bank Account, it can only be canceled if the status is 'processing'.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 22727,
        "charEnd": 22760
      },
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 23080,
        "charEnd": 23138
      }
    ]
  },
  {
    "id": "q34",
    "documentId": "doc-2-stripe-3.md",
    "query": "If I issue a refund via the Dashboard, can I enter a different amount to only refund part of the transaction, and does the Dashboard also allow me to bulk refund partial amounts?",
    "queryType": "factual",
    "expectedAnswer": "You can enter a different amount to issue a partial refund for an individual payment, but the Dashboard's bulk refund feature only supports full refunds; partial refunds must be issued individually.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 3434,
        "charEnd": 3523
      }
    ]
  },
  {
    "id": "q35",
    "documentId": "doc-2-stripe-3.md",
    "query": "If a Konbini refund requires bank account details but the customer doesn't respond before the expiration timestamp, what happens to the refund status, and what webhook event notifies me that it did not succeed?",
    "queryType": "factual",
    "expectedAnswer": "The refund status transitions to 'failed', and Stripe will trigger the 'refund.failed' webhook event.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 16158,
        "charEnd": 16210
      }
    ]
  },
  {
    "id": "q36",
    "documentId": "doc-2-stripe-3.md",
    "query": "Can I cancel a refund that is waiting for a promptpay customer to submit their bank details, and if so, what failure attributes will be added to the Refund object once canceled?",
    "queryType": "multi-hop",
    "expectedAnswer": "Yes, you can cancel a refund while it's in the requires_action state. Once canceled, it transitions to a 'canceled' status and the attributes 'failure_reason' and 'failure_balance_transaction' are included.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 16226,
        "charEnd": 16254
      },
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 13765,
        "charEnd": 13810
      }
    ]
  },
  {
    "id": "q37",
    "documentId": "doc-2-stripe-3.md",
    "query": "If my platform uses destination charges and a refund fails, where do the funds go, and who is originally debited when that refund is first created?",
    "queryType": "multi-hop",
    "expectedAnswer": "When the refund is created, Stripe debits your platform. If the refund subsequently fails, the funds are deposited back to your platform account's Stripe balance.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 5560,
        "charEnd": 5599
      },
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 12867,
        "charEnd": 12943
      }
    ]
  },
  {
    "id": "q38",
    "documentId": "doc-2-stripe-3.md",
    "query": "I want to refund a SEPA Direct Debit payment. Why might the customer receive two credits, and if a refund fails for an unknown reason, what failure reason is given?",
    "queryType": "multi-hop",
    "expectedAnswer": "The customer might receive two credits if you proactively issue a refund while the customer's bank also initiates a dispute. If a refund fails for an unknown reason, the failure reason is simply 'unknown'.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 8328,
        "charEnd": 8362
      },
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 11719,
        "charEnd": 11761
      }
    ]
  },
  {
    "id": "q39",
    "documentId": "doc-2-stripe-3.md",
    "query": "To trace an eu_bank_transfer refund via the API, what field holds the reference number, and how many business days does it typically take for a customer to see the credit?",
    "queryType": "multi-hop",
    "expectedAnswer": "The reference number is held in destination_details.eu_bank_transfer.reference. It typically takes approximately 5-10 business days for the customer to see the credit.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 21429,
        "charEnd": 21446
      },
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 18362,
        "charEnd": 18437
      }
    ]
  },
  {
    "id": "q40",
    "documentId": "doc-2-stripe-3.md",
    "query": "If I create a refund and the review is subsequently closed as fraudulent, which webhook event is sent, and what reason field value should I expect?",
    "queryType": "keyword",
    "expectedAnswer": "The 'review.closed' event is sent, and the reason field will show 'refunded_as_fraud'.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 25212,
        "charEnd": 25266
      }
    ]
  },
  {
    "id": "q41",
    "documentId": "doc-2-stripe-3.md",
    "query": "If an email is successfully sent to a customer regarding their refund, what conditions must have been met for that email to go out, and what field records the exact time the email was dispatched?",
    "queryType": "multi-hop",
    "expectedAnswer": "The email is sent if the charge was created on a customer in the account, they have a stored email, and 'Email customers for refunds' is enabled. The exact dispatch time is recorded in the 'next_action.display_details.email_sent_at' field (if it requires action).",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 1590,
        "charEnd": 1630
      },
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 15541,
        "charEnd": 15556
      }
    ]
  },
  {
    "id": "q44",
    "documentId": "doc-2-stripe-3.md",
    "query": "My customer is complaining that their original charge just dropped off their statement and they didn't get a separate credit. Does this mean the reimbursement failed?",
    "queryType": "semantic",
    "expectedAnswer": "No, this means the refund was processed as a reversal. When issued shortly after the original charge, the charge drops off the statement and no separate credit is issued.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 18593,
        "charEnd": 18694
      }
    ]
  },
  {
    "id": "q45",
    "documentId": "doc-2-stripe-3.md",
    "query": "If my integration relies on Connect with destination charges, where exactly does Stripe pull the funds from when a reimbursement is first issued to the buyer?",
    "queryType": "factual",
    "expectedAnswer": "Stripe debits your platform for refunds to destination charge payments.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 5560,
        "charEnd": 5599
      }
    ]
  },
  {
    "id": "q46",
    "documentId": "doc-2-stripe-3.md",
    "query": "My buyer entered a typo in their account number, so the transfer couldn't complete. Will this take up to 30 days to return to my Stripe balance like other bounced transactions?",
    "queryType": "factual",
    "expectedAnswer": "No. When a bank account number has a typo during a requires_action refund (like Konbini), the funds are returned to Stripe, the status transitions back to requires_action, and Stripe emails the customer again. The 30-day return to your balance applies to standard failed refunds, not requires_action corrections.",
    "relevantSpans": [
      {
        "documentId": "doc-2-stripe-3.md",
        "charStart": 16555,
        "charEnd": 16629
      }
    ]
  }
];
